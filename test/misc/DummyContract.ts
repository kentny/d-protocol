import { ethers } from 'hardhat'
import { DummyContract } from '../../typechain-types'

export const deployDummyContract = async (): Promise<DummyContract> => {
    const DummyContract = await ethers.getContractFactory('DummyContract')
    const dummyContract = await DummyContract.deploy()

    return dummyContract
}
