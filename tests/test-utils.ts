// Mock implementations for Clarity environment

export const mockClarityBitcoin = {
	// Mock Bitcoin-related functions
	parseTransaction: vi.fn(),
	verifyMerkleProof: vi.fn(),
	// Add other Bitcoin-related functions as needed
};

export const mockClarityBlockInfo = {
	// Mock block info functions
	getBlockInfo: vi.fn().mockImplementation((type, height) => {
		if (type === 'time') {
			return Date.now() / 1000; // Current time in seconds
		}
		return null;
	}),
	// Add other block info functions as needed
};

// Mock tx-sender
global.txSender = vi.fn().mockReturnValue('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');

// Mock contract-call?
global.contractCall = vi.fn().mockImplementation((contract, method, ...args) => {
	// This would need to be expanded to handle actual contract calls
	return { isOk: true, value: true };
});
