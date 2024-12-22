import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import normalizeUrl from 'normalize-url';
import type { Options as normalizeUrlOptions } from 'normalize-url';

export class NormalizeUrl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Normalize URL',
		name: 'normalizeUrl',
		icon: 'file:normalizeUrl.svg',
		group: ['transform'],
		version: 1,
		description: 'Normalizes a URL using the normalize-url package',
		defaults: {
			name: 'Normalize URL',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com',
				description: 'The URL to normalize',
				required: true,
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Normalize Protocol',
						name: 'normalizeProtocol',
						type: 'boolean',
						default: true,
						description: 'Normalize the protocol',
					},
					{
						displayName: 'Force HTTP',
						name: 'forceHttp',
						type: 'boolean',
						default: false,
						description: 'Force HTTP protocol',
					},
					{
						displayName: 'Force HTTPS',
						name: 'forceHttps',
						type: 'boolean',
						default: false,
						description: 'Force HTTPS protocol',
					},
					{
						displayName: 'Strip Authentication',
						name: 'stripAuthentication',
						type: 'boolean',
						default: true,
						description: 'Remove authentication',
					},
					{
						displayName: 'Strip Hash',
						name: 'stripHash',
						type: 'boolean',
						default: false,
						description: 'Remove hash from the URL',
					},
					{
						displayName: 'Strip Protocol',
						name: 'stripProtocol',
						type: 'boolean',
						default: false,
						description: 'Remove the protocol from the URL',
					},
					{
						displayName: 'Strip Text Fragment',
						name: 'stripTextFragment',
						type: 'boolean',
						default: true,
						description: 'Remove the text fragment from the URL',
					},
					{
						displayName: 'Strip WWW',
						name: 'stripWWW',
						type: 'boolean',
						default: true,
						description: 'Remove www. from the URL.',
					},
					{
						displayName: 'Remove Query Parameters',
						name: 'removeQueryParameters',
						type: 'boolean',
						default: false,
						description: 'Remove query parameters from the URL',
					},
					{
						displayName: 'Remove Trailing Slash',
						name: 'removeTrailingSlash',
						type: 'boolean',
						default: true,
						description: 'Remove trailing slash from the URL',
					},
					{
						displayName: 'Remove Single Slash',
						name: 'removeSingleSlash',
						type: 'boolean',
						default: true,
						description: 'Remove single slash from the URL',
					},
					{
						displayName: 'Remove Directory Index',
						name: 'removeDirectoryIndex',
						type: 'boolean',
						default: false,
						description: 'Remove directory index (e.g., index.html) from the URL',
					},
					{
						displayName: 'Remove Explicit Port',
						name: 'removeExplicitPort',
						type: 'boolean',
						default: true,
						description: 'Remove explicit port from the URL',
					},
					{
						displayName: 'Sort Query Parameters',
						name: 'sortQueryParameters',
						type: 'boolean',
						default: true,
						description: 'Sort query parameters alphabetically',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const url = this.getNodeParameter('url', i) as string;
				const options = this.getNodeParameter('options', i) as normalizeUrlOptions;

				const normalizedUrl = normalizeUrl(url, options);

				returnData.push({
					json: { normalizedUrl },
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// // Test the node
// const testNode = new NormalizeUrl();
// const testUrl = 'HTTP://example.com:80/foo/bar/../baz?sort=desc&q=query#hash';
// const testOptions = {
// 	normalizeProtocol: true,
// 	forceHttps: true,
// 	stripWWW: true,
// 	removeTrailingSlash: true,
// 	sortQueryParameters: true,
// };

// const mockExecuteFunctions = {
// 	getInputData: () => [{}],
// 	getNodeParameter: (name: string) => {
// 		if (name === 'url') return testUrl;
// 		if (name === 'options') return testOptions;
// 	},
// 	continueOnFail: () => false,
// } as any;

// const result = await testNode.execute.call(mockExecuteFunctions);
