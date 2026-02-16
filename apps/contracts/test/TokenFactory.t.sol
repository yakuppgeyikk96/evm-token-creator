// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {BaseToken} from "../src/BaseToken.sol";

contract TokenFactoryTest is Test {
    TokenFactory public factory;

    address public owner = address(this);
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    receive() external payable {}

    function setUp() public {
        factory = new TokenFactory();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
    }

    // ========== Helper ==========

    function _defaultConfig()
        internal
        pure
        returns (BaseToken.TokenConfig memory)
    {
        return
            BaseToken.TokenConfig({
                isMintable: true,
                isBurnable: true,
                isPausable: true
            });
    }

    function _defaultParams()
        internal
        pure
        returns (TokenFactory.CreateTokenParams memory)
    {
        return
            TokenFactory.CreateTokenParams({
                name: "Test Token",
                symbol: "TST",
                initialSupply: 1_000_000 ether,
                cap: 10_000_000 ether,
                config: _defaultConfig()
            });
    }

    function _createDefaultToken() internal returns (BaseToken) {
        vm.prank(alice);
        address tokenAddr = factory.createToken(_defaultParams());
        return BaseToken(tokenAddr);
    }

    // ========== Factory Deployment ==========

    function test_FactoryDeployment() public view {
        assertEq(factory.owner(), owner);
        assertEq(factory.creationFee(), 0);
        assertEq(factory.getTokenCount(), 0);
    }

    // ========== Token Creation ==========

    function test_CreateToken() public {
        vm.prank(alice);
        address tokenAddr = factory.createToken(_defaultParams());

        assertTrue(tokenAddr != address(0));
        assertEq(factory.getTokenCount(), 1);

        BaseToken token = BaseToken(tokenAddr);
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TST");
        assertEq(token.totalSupply(), 1_000_000 ether);
        assertEq(token.cap(), 10_000_000 ether);
        assertEq(token.balanceOf(alice), 1_000_000 ether);
        assertEq(token.owner(), alice);
    }

    function test_CreateTokenEmitsEvent() public {
        TokenFactory.CreateTokenParams memory params = _defaultParams();

        vm.prank(alice);
        vm.expectEmit(false, true, false, true);
        emit TokenFactory.TokenCreated(
            address(0), // we don't know the address yet
            alice,
            "Test Token",
            "TST",
            1_000_000 ether,
            10_000_000 ether
        );
        factory.createToken(params);
    }

    function test_CreateTokenNoCap() public {
        TokenFactory.CreateTokenParams memory params = _defaultParams();
        params.cap = 0; // no cap

        vm.prank(alice);
        address tokenAddr = factory.createToken(params);

        BaseToken token = BaseToken(tokenAddr);
        assertEq(token.cap(), type(uint256).max);
    }

    function test_CreateTokenZeroSupply() public {
        TokenFactory.CreateTokenParams memory params = _defaultParams();
        params.initialSupply = 0;

        vm.prank(alice);
        address tokenAddr = factory.createToken(params);

        BaseToken token = BaseToken(tokenAddr);
        assertEq(token.totalSupply(), 0);
        assertEq(token.balanceOf(alice), 0);
    }

    function test_CreateMultipleTokens() public {
        vm.startPrank(alice);
        factory.createToken(_defaultParams());
        factory.createToken(_defaultParams());
        vm.stopPrank();

        vm.prank(bob);
        factory.createToken(_defaultParams());

        assertEq(factory.getTokenCount(), 3);
        assertEq(factory.getTokensByCreator(alice).length, 2);
        assertEq(factory.getTokensByCreator(bob).length, 1);
        assertEq(factory.getAllTokens().length, 3);
    }

    // ========== Token Features: Mint ==========

    function test_MintWhenEnabled() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.mint(bob, 500 ether);
        assertEq(token.balanceOf(bob), 500 ether);
    }

    function test_MintRevertWhenDisabled() public {
        TokenFactory.CreateTokenParams memory params = _defaultParams();
        params.config.isMintable = false;

        vm.prank(alice);
        address tokenAddr = factory.createToken(params);
        BaseToken token = BaseToken(tokenAddr);

        vm.prank(alice);
        vm.expectRevert("BaseToken: minting disabled");
        token.mint(bob, 100 ether);
    }

    function test_MintRevertWhenNotOwner() public {
        BaseToken token = _createDefaultToken();

        vm.prank(bob);
        vm.expectRevert();
        token.mint(bob, 100 ether);
    }

    function test_MintRevertWhenExceedsCap() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        vm.expectRevert();
        token.mint(alice, 10_000_000 ether); // already has 1M, cap is 10M
    }

    // ========== Token Features: Burn ==========

    function test_BurnWhenEnabled() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.burn(100 ether);
        assertEq(token.balanceOf(alice), 999_900 ether);
    }

    function test_BurnFromWhenEnabled() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.approve(bob, 200 ether);

        vm.prank(bob);
        token.burnFrom(alice, 200 ether);
        assertEq(token.balanceOf(alice), 999_800 ether);
    }

    function test_BurnRevertWhenDisabled() public {
        TokenFactory.CreateTokenParams memory params = _defaultParams();
        params.config.isBurnable = false;

        vm.prank(alice);
        address tokenAddr = factory.createToken(params);
        BaseToken token = BaseToken(tokenAddr);

        vm.prank(alice);
        vm.expectRevert("BaseToken: burning disabled");
        token.burn(100 ether);
    }

    // ========== Token Features: Pause ==========

    function test_PauseWhenEnabled() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.pause();

        vm.prank(alice);
        vm.expectRevert();
        token.transfer(bob, 100 ether);

        vm.prank(alice);
        token.unpause();

        vm.prank(alice);
        token.transfer(bob, 100 ether);
        assertEq(token.balanceOf(bob), 100 ether);
    }

    function test_PauseRevertWhenDisabled() public {
        TokenFactory.CreateTokenParams memory params = _defaultParams();
        params.config.isPausable = false;

        vm.prank(alice);
        address tokenAddr = factory.createToken(params);
        BaseToken token = BaseToken(tokenAddr);

        vm.prank(alice);
        vm.expectRevert("BaseToken: pausing disabled");
        token.pause();
    }

    function test_PauseRevertWhenNotOwner() public {
        BaseToken token = _createDefaultToken();

        vm.prank(bob);
        vm.expectRevert();
        token.pause();
    }

    // ========== Fee Mechanism ==========

    function test_SetCreationFee() public {
        factory.setCreationFee(0.01 ether);
        assertEq(factory.creationFee(), 0.01 ether);
    }

    function test_SetCreationFeeEmitsEvent() public {
        vm.expectEmit(true, true, true, true);
        emit TokenFactory.CreationFeeUpdated(0, 0.01 ether);
        factory.setCreationFee(0.01 ether);
    }

    function test_SetCreationFeeRevertWhenNotOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        factory.setCreationFee(0.01 ether);
    }

    function test_CreateTokenWithFee() public {
        factory.setCreationFee(0.01 ether);

        vm.prank(alice);
        address tokenAddr = factory.createToken{value: 0.01 ether}(
            _defaultParams()
        );
        assertTrue(tokenAddr != address(0));
        assertEq(address(factory).balance, 0.01 ether);
    }

    function test_CreateTokenRevertInsufficientFee() public {
        factory.setCreationFee(0.01 ether);

        vm.prank(alice);
        vm.expectRevert("TokenFactory: insufficient fee");
        factory.createToken{value: 0.005 ether}(_defaultParams());
    }

    function test_Withdraw() public {
        factory.setCreationFee(0.01 ether);

        vm.prank(alice);
        factory.createToken{value: 0.01 ether}(_defaultParams());

        uint256 balanceBefore = owner.balance;
        factory.withdraw();
        assertEq(owner.balance, balanceBefore + 0.01 ether);
        assertEq(address(factory).balance, 0);
    }

    function test_WithdrawRevertWhenEmpty() public {
        vm.expectRevert("TokenFactory: nothing to withdraw");
        factory.withdraw();
    }

    function test_WithdrawRevertWhenNotOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        factory.withdraw();
    }

    // ========== Token Config Getter ==========

    function test_GetConfig() public {
        BaseToken token = _createDefaultToken();

        BaseToken.TokenConfig memory config = token.getConfig();
        assertTrue(config.isMintable);
        assertTrue(config.isBurnable);
        assertTrue(config.isPausable);
    }

    // ========== Ownership Transfer Tracking ==========

    function test_CreateTokenTracksOwner() public {
        BaseToken token = _createDefaultToken();

        address[] memory owned = factory.getTokensByOwner(alice);
        assertEq(owned.length, 1);
        assertEq(owned[0], address(token));
    }

    function test_TransferOwnershipUpdatesFactory() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.transferOwnership(bob);

        // bob should now own the token
        address[] memory bobOwned = factory.getTokensByOwner(bob);
        assertEq(bobOwned.length, 1);
        assertEq(bobOwned[0], address(token));

        // alice should no longer own it
        address[] memory aliceOwned = factory.getTokensByOwner(alice);
        assertEq(aliceOwned.length, 0);

        // token's owner should be bob
        assertEq(token.owner(), bob);
    }

    function test_TransferOwnershipCreatorListUnchanged() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.transferOwnership(bob);

        // creator list should still show alice
        address[] memory created = factory.getTokensByCreator(alice);
        assertEq(created.length, 1);
        assertEq(created[0], address(token));
    }

    function test_OnOwnershipTransferredRevertWhenNotRegistered() public {
        vm.prank(alice);
        vm.expectRevert("TokenFactory: not a registered token");
        factory.onOwnershipTransferred(alice, bob);
    }

    // ========== ERC-20 Standard ==========

    function test_Transfer() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.transfer(bob, 1_000 ether);
        assertEq(token.balanceOf(bob), 1_000 ether);
        assertEq(token.balanceOf(alice), 999_000 ether);
    }

    function test_Approve_TransferFrom() public {
        BaseToken token = _createDefaultToken();

        vm.prank(alice);
        token.approve(bob, 5_000 ether);

        vm.prank(bob);
        token.transferFrom(alice, bob, 5_000 ether);
        assertEq(token.balanceOf(bob), 5_000 ether);
    }
}
