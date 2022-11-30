// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ReserveType } from './type/ReserveType.sol';
import { ErrorType } from './type/ErrorType.sol';

import "@openzeppelin/contracts/utils/Address.sol";


contract LendingPool {
    mapping(address => ReserveType.Data) private _reserves;

    constructor() {
        
    }

    function setupReserve(
        address asset,
        address aoToken,                // TODO: Should restrict with the AoToken interface.
        address debtToken,              // TODO: Should restrict with the DebtToken interface.
        address interestRateProvider    // TODO: Should restrict with the IInterestRateProvider interface.
    ) external {
        require(
            Address.isContract(asset),
            ErrorType.NOT_CONTRACT
        );

        _reserves[asset] = ReserveType.Data(
            aoToken,
            debtToken,
            interestRateProvider
        );
    }

    function deposit() external {
    }

    function withdraw() external {
        
    }

    function getReserveData(address _asset) external view returns (ReserveType.Data memory) {
        return _reserves[_asset];
    }
}
