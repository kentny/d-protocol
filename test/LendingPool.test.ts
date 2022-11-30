import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('LendingPool', () => {
    const deployLendingPoolFixture = async () => {
        const LendingPool = await ethers.getContractFactory('LendingPool')
        const lendingPool = await LendingPool.deploy()

        const [owner, otherAccount] = await ethers.getSigners()

        return { lendingPool, owner, otherAccount }
    }

    const deployDummyContract = async () => {
        const DummyContract = await ethers.getContractFactory('DummyContract')
        const dummyContract = await DummyContract.deploy()

        return dummyContract
    }

    describe('setupReserve', () => {
        it('Should create a new reserve!!!', async () => {
            const { lendingPool } = await deployLendingPoolFixture()
            const dummyAsset = (await deployDummyContract()).address
            const dummyAoToken = (await deployDummyContract()).address
            const dummyDebtToken = (await deployDummyContract()).address
            const dummyInterestRateProvider = (await deployDummyContract()).address

            await lendingPool.setupReserve(dummyAsset, dummyAoToken, dummyDebtToken, dummyInterestRateProvider)

            const reserveData = await lendingPool.getReserveData(dummyAsset)
            expect(reserveData.aoToken).to.equal(dummyAoToken)
            expect(reserveData.debtToken).to.equal(dummyDebtToken)
            expect(reserveData.interestRateProvider).to.equal(dummyInterestRateProvider)
        })

        describe('Security', () => {
            it('Should revert if `asset` is not a contract address', async () => {
                const { lendingPool, otherAccount } = await deployLendingPoolFixture()
                const dummyContract = await deployDummyContract()
                const dummyContractAddress = dummyContract.address

                await expect(
                    lendingPool.setupReserve(
                        otherAccount.address,
                        dummyContractAddress,
                        dummyContractAddress,
                        dummyContractAddress
                    )
                ).to.be.revertedWith('Not Contract')
            })
        })
    })

    describe('deposit', () => {
        it('Should allow external access', async () => {
            const { lendingPool } = await deployLendingPoolFixture()

            await expect(lendingPool.deposit()).to.not.be.reverted
        })

        describe('Security', () => {
            // TODO
        })
    })

    describe('withdraw', async () => {
        it('Should allow external access', async () => {
            const { lendingPool } = await deployLendingPoolFixture()

            await expect(lendingPool.withdraw()).to.not.be.reverted
        })

        describe('Security', () => {
            // TODO
        })
    })
})
