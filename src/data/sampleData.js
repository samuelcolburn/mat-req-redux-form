import mockJobs from './jobs'
import mockShopDrawings from './shopDrawings'
import mockPhases from './phases'
import mockRequisitions from './requisitions'
import mockRequisitionLineItems from './requisitionLineItems'
import mockVendors from './vendors'

const makeSampleData = () => {
  const jobs = mockJobs(10)
  const shopDrawings = mockShopDrawings(jobs, { min: 2, max: 5})
  const phases = mockPhases(jobs, shopDrawings, { min: 2, max: 5})
  const requisitions = mockRequisitions(shopDrawings, { min: 2, max: 5 })
  const requisitionLineItems = mockRequisitionLineItems(requisitions, phases, { min: 2, max: 5 })

  const vendors = mockVendors(100)

  const sampleData = {
    jobs,
    shopDrawings,
    phases,
    requisitions,
    requisitionLineItems,
    vendors
  }

  console.log('sampleData: ', sampleData)

  return sampleData
}

const sampleData = makeSampleData()

export default sampleData
