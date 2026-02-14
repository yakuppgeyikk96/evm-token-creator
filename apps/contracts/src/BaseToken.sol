// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {
    ERC20Burnable
} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {
    ERC20Pausable
} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {
    ERC20Capped
} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BaseToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    ERC20Capped,
    Ownable
{
    struct TokenConfig {
        bool isMintable;
        bool isBurnable;
        bool isPausable;
    }

    TokenConfig private _config;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address owner_,
        uint256 cap_,
        TokenConfig memory config_
    )
        ERC20(name_, symbol_)
        ERC20Capped(cap_ == 0 ? type(uint256).max : cap_)
        Ownable(owner_)
    {
        _config = config_;
        if (initialSupply_ > 0) {
            _mint(owner_, initialSupply_);
        }
    }

    function getConfig() external view returns (TokenConfig memory) {
        return _config;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(_config.isMintable, "BaseToken: minting disabled");
        _mint(to, amount);
    }

    function burn(uint256 amount) public override {
        require(_config.isBurnable, "BaseToken: burning disabled");
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override {
        require(_config.isBurnable, "BaseToken: burning disabled");
        super.burnFrom(account, amount);
    }

    function pause() external onlyOwner {
        require(_config.isPausable, "BaseToken: pausing disabled");
        _pause();
    }

    function unpause() external onlyOwner {
        require(_config.isPausable, "BaseToken: pausing disabled");
        _unpause();
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable, ERC20Capped) {
        super._update(from, to, value);
    }
}
