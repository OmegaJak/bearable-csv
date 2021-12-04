import { CSVReader } from "react-papaparse";
import React from "react";
import Head from "next/head";
import classnames from "classnames";
import { Row, CsvRow } from "../lib/types";

type Props = {
	rows: Row[],
	setRows: React.Dispatch<React.SetStateAction<Row[]>>
}

export default function Home({ rows, setRows }: Props) {
	const onLoad = (data: CsvRow[]) => {
		setRows(
			data.map((r) => ({
				date: r.data[0],
				weekday: r.data[1],
				time_of_day: r.data[2],
				category: r.data[3],
				rating_or_amount: r.data[4],
				detail: r.data[5],
				notes: r.data[6],
			} as Row))
		);
	};

	const onError = () => { };

	const onRemoveFile = () => {
		setRows(() => [] as Row[])
	}

	return (
		<>
			<Head>
				<title>Bearable CSV to HTML</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link
					rel="stylesheet"
					href="https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css"
				/>
			</Head>
			<div className={classnames("sans-serif", "mw8", "center", "ma4")}>
				<h1 className="mb0">Bearable CSV to HTML</h1>
				<div className="no-print mb5">
					<p className="ma0 mt1 f4 mb4 black-80 lh-copy">
						Questions? Feature requests? Please{" "}
						<a href="https://github.com/samstarling/bearable-csv/issues">
							raise an issue on GitHub
            </a>
            .
          </p>
					<CSVReader onDrop={onLoad} onError={onError} onRemoveFile={onRemoveFile} addRemoveButton>
						Click to select CSV
					</CSVReader>
					<div className="ba bw1 b--blue pa3 blue mt3">
						All processing is handled in your browser: the CSV you select is not
						uploaded anywhere.
					</div>
				</div>
			</div>
		</>
	);
}