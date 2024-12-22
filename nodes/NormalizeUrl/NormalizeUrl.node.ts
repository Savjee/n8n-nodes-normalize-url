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
		inputs: ['main' as NodeConnectionType],
		outputs: ['main' as NodeConnectionType],
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
						displayName: 'Force HTTP',
						name: 'forceHttp',
						type: 'boolean',
						default: false,
						description: 'Whether to force HTTP protocol',
					},
					{
						displayName: 'Force HTTPS',
						name: 'forceHttps',
						type: 'boolean',
						default: false,
						description: 'Whether to force HTTPS protocol',
					},
					{
						displayName: 'Normalize Protocol',
						name: 'normalizeProtocol',
						type: 'boolean',
						default: true,
						description: 'Whether to normalize the protocol',
					},
					{
						displayName: 'Remove Directory Index',
						name: 'removeDirectoryIndex',
						type: 'boolean',
						default: false,
						description: 'Whether to remove directory index (e.g., index.html) from the URL',
					},
					{
						displayName: 'Remove Explicit Port',
						name: 'removeExplicitPort',
						type: 'boolean',
						default: true,
						description: 'Whether to remove explicit port from the URL',
					},
					{
						displayName: 'Remove Query Parameters',
						name: 'removeQueryParameters',
						type: 'boolean',
						default: false,
						description: 'Whether to remove query parameters from the URL',
					},
					{
						displayName: 'Remove Single Slash',
						name: 'removeSingleSlash',
						type: 'boolean',
						default: true,
						description: 'Whether to remove single slash from the URL',
					},
					{
						displayName: 'Remove Trailing Slash',
						name: 'removeTrailingSlash',
						type: 'boolean',
						default: true,
						description: 'Whether to remove trailing slash from the URL',
					},
					{
						displayName: 'Sort Query Parameters',
						name: 'sortQueryParameters',
						type: 'boolean',
						default: true,
						description: 'Whether to sort query parameters alphabetically',
					},
					{
						displayName: 'Strip Authentication',
						name: 'stripAuthentication',
						type: 'boolean',
						default: true,
						description: 'Whether to remove authentication',
					},
					{
						displayName: 'Strip Hash',
						name: 'stripHash',
						type: 'boolean',
						default: false,
						description: 'Whether to remove hash from the URL',
					},
					{
						displayName: 'Strip Protocol',
						name: 'stripProtocol',
						type: 'boolean',
						default: false,
						description: 'Whether to remove the protocol from the URL',
					},
					{
						displayName: 'Strip Text Fragment',
						name: 'stripTextFragment',
						type: 'boolean',
						default: true,
						description: 'Whether to remove the text fragment from the URL',
					},
					{
						displayName: 'Strip WWW',
						name: 'stripWWW',
						type: 'boolean',
						default: true,
						description: 'Whether to remove www. from the URL.',
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
