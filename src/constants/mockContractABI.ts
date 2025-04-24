
// MOCK ABI - Replace with actual contract ABI in production
export const MOCK_NFT_CONTRACT_ABI = [
  "event TraitsAssigned(uint256 indexed tokenId, address indexed owner, string[] positiveTraits, string[] negativeTraits)",
  "function mintRequest(string memory tokenURI) external returns (uint256)",
];

export const MOCK_NFT_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
