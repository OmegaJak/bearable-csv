import { Row } from "../lib/types";
import classnames from "classnames";
import Enumerable from 'linq';
import { ChangeEvent, useState } from "react";

export default function Analyses({rows}: { rows: Row[] }) {
	const [selectedSymptom, updatedSelectedSymptom] = useState<string | undefined>(undefined);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		updatedSelectedSymptom(event.target.value);
	}

	const symptoms = getSymptoms(rows);

	return (
		<div className={classnames("sans-serif", "mw8", "center", "ma4")}>
			<div>Number of Rows: {numRows(rows)}</div>
			<div>
				Symptoms:
				<ul>
					{
						getSymptomAnalyses(symptoms, rows).map(analysis => {
							return (
								<li key={analysis.symptomName}>{analysis.symptomName}: {analysis.average}</li>
							)
						})
					}
				</ul>
			</div>
			<div>
				<form>
					<label htmlFor="symptoms">Choose a Symptom:</label>
					<select name="symptoms" id="symptoms" value={selectedSymptom} onChange={handleChange}>
						<option value={undefined}>None</option>
						{symptoms.map(s => {
							return <option value={s}>{s}</option>
						})}
					</select>
				</form>
				<h1>Chosen Symptom: {selectedSymptom}</h1>
			</div>
		</div>
	)
}

function numRows(rows: Row[]): number {
	return rows.length;
}

function getSymptoms(rows: Row[]): string[] {
	var enumerable = Enumerable.from(rows);
	var detailRegex: RegExp = /(.*)(\(.*\))/;
	console.time("getSymptoms");
	var symptoms = enumerable.where(r => r.category == "Symptom")
		.select(r => r.detail)
		.distinct()
		.select(detail => detailRegex.exec(detail)?.[1] ?? "{error}")
		.distinct()
		.toArray();
	console.timeEnd("getSymptoms");
	return symptoms;
}

type SymptomAnalysis = { symptomName: string, average: number };

function getSymptomAnalyses(symptoms: string[], rows: Row[]): SymptomAnalysis[] {
	console.time("getSymptomAnalyses");
	var enumerableRows = Enumerable.from(rows);
	let averages = new Array<SymptomAnalysis>();
	for (let symptom of symptoms) {
		const relevantRows = enumerableRows.where(r => r.detail.includes(symptom));
		const values = relevantRows.select(r => parseInt(r.rating_or_amount));
		const average = values.average();
		averages.push({ symptomName: symptom, average: average });
	}

	console.timeEnd("getSymptomAnalyses");
	return averages;
}