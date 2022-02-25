export interface Claim {
  index: number
  address: string
  amount: string
  proof: string[]
}

export interface ClaimMap {
  [key: string]: Claim
}

