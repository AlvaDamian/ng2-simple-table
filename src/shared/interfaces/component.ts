export interface Ng2STComponent {

	component(): any;
	inputs(): Array<{name: string, value: any}>;
}