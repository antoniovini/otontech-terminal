interface ConsoleState {
	locked: boolean,
	loading: boolean,
	inputProps?: InputProps,
	lines: ILine[]
}

interface InputProps {
	label: string,
	type?: string | null
}

interface ILine {
	text: string,
	type?: string,
	inputType?: string | null
}

interface ScanParams {
	label: string,
	type?: string | null,
}

const emitEvent = (eventName: string, value: any) => {
	const event = new CustomEvent(eventName, { detail: value });
	document.dispatchEvent(event);
}

const setState = (newState: ConsoleState) => {
	emitEvent("setState", newState);
}

const getState = async (refresh: number = 500, retries: number = 300) => {
	let result: ConsoleState | undefined;
	const listener = (evt: any) => {
		result = evt.detail;
	};

	let count = 0;

	document.addEventListener("getStateResponse", listener);
	emitEvent("getState", null);

	return new Promise<ConsoleState>((resolve, reject) => {
		var timer = setInterval(() => {
			if (result !== undefined) {
				resolve(result);
				document.removeEventListener("getStateResponse", listener);
				clearInterval(timer);
			} else {
				count += 1;
				if (retries <= count) {
					reject(`Max Retries: ${count}/${retries}`);
				}
			}
		}, refresh);
	});
}

export const scan = async ({ label = "", type }: ScanParams) => {
	const state = await getState();
	const initialLoading = state.loading;
	setState({
		...state,
		loading: false,
		locked: true,
		inputProps: {
			label,
			type,
		}
	});

	let result: string;
	const listener = (evt: any) => {
		result = evt.detail;
	};

	document.addEventListener("onInput", listener);
	return new Promise<string>((resolve, reject) => {
		var timer = setInterval(() => {
			if (result != null) {
				clearInterval(timer);
				// TODO - se der problema, adicionamos o evento no document
				document.removeEventListener("onInput", listener);
				setState({
					...state,
					loading: initialLoading,
					locked: false,
					inputProps: { label: "", type: null }
				});
				resolve(result);
			}
		}, 1);
	});
}

interface PrintConfig {
	type?: string,
	inputType?: string | null
}

export const print = async (text: string, config?: PrintConfig) => {
	emitEvent("addLine", { text, ...config });
}

export const clear = async () => {
	emitEvent("setLines", []);
}

const terminal = {
	scan,
	print,
	clear
}

export default terminal;