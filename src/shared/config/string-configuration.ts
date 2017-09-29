import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class StringConfiguration {

	public onConfigurationChange: Subject<void>;

	private noData: string;
	private loading: string;
	private filter: string;

	private onTransaction: boolean;
	private changes: Map<string, string>;

	public constructor() {
		this.onTransaction = false;
		this.changes = new Map<string, string>();
		this.onConfigurationChange = Subject.create();
	}

	private addChange(key: string, value: string): void {
		this.changes.set(key, value);
	}

	public beginTransaction(): void {
		this.onTransaction = true;
	}

	public commit(): void {

		if (this.onTransaction) {

			this
			.changes
			.forEach((v, k) => {
				if (k === "noData") {
					this.noData = v;
				}

				if (k === "loading") {
					 this.loading = v;
				}

				if (k === "filter") {
					this.filter = v;
				}
			});

			this.onTransaction = false;
			this.onConfigurationChange.next();
		}
	}

	public rollBack(): void {

		if (this.onTransaction) {
			this.changes.clear();
			this.onTransaction = false;
		}
	}

	public setNoData(str: string): StringConfiguration {
		this.addChange("noData", str);
		return this;
	}

	public setLoading(str: string): StringConfiguration {
		this.addChange("loading", str);
		return this;
	}

	public setFilter(str: string): StringConfiguration {
		this.addChange("filter", str);
		return this;
	}
}