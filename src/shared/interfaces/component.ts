export interface Ng2STComponent {

	component(): any;
	inputs(): Array<{ name: string, value: any }>;
	events(): Array<{ name: string, handler: (...args: any[]) => void }>;
}