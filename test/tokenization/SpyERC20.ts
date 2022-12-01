import { ethers } from 'hardhat'
import { SpyERC20 } from '../../typechain-types'

export const deploySpyERC20 = async (): Promise<SpyERC20> => {
    const SpyERC20 = await ethers.getContractFactory('SpyERC20')
    const spyERC20 = await SpyERC20.deploy()

    return spyERC20
}
