export default function range(from, to, step = 1) {
	return {
		[Symbol.iterator]() {
			return {
				current: from,
				to,
				from,
				step,
				next() {
					const it = { done: this.current >= this.to, value: this.current };
					this.current += this.step;
					return it;
				},
			};
		},
	};
}
