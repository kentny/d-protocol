// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { IAoToken } from './tokenization/IAoToken.sol';
import { ReserveType } from './type/ReserveType.sol';
import { ErrorType } from './type/ErrorType.sol';

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";


contract LendingPool {
    using SafeERC20 for IERC20;

    mapping(address => ReserveType.Data) private _reserves;

    constructor() {
        
    }

    function setupReserve(
        address asset,
        IAoToken aoToken,                // TODO: Should restrict with the AoToken interface.
        address debtToken,              // TODO: Should restrict with the DebtToken interface.
        address interestRateProvider,   // TODO: Should restrict with the IInterestRateProvider interface.
        bool isOverCol
    ) external {
        require(
            Address.isContract(asset),
            ErrorType.NOT_CONTRACT
        );

        _reserves[asset] = ReserveType.Data(
            aoToken,
            debtToken,
            interestRateProvider,
            isOverCol
        );
    }

    function deposit(
        address asset,
        uint256 amount
    ) external {
        // IERC20(asset).safeTransferFrom(msg.sender, aToken, amount);
        require(_isValidAsset(asset), ErrorType.NOT_REGISTERED_ASSET);

        ReserveType.Data memory reserve = _reserves[asset];
        IERC20(asset).safeTransferFrom(msg.sender, address(reserve.aoToken), amount);
    }

    function withdraw() external {
        
    }

    function getReserveData(address _asset) external view returns (ReserveType.Data memory) {
        return _reserves[_asset];
    }

    function _isValidAsset(address _asset) internal view returns (bool) {
        ReserveType.Data memory reserve = _reserves[_asset];
        return address(reserve.aoToken) != address(0);
    }
}
