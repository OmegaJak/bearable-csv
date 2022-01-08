import { LocalDate } from "@js-joda/core";
import Enumerable from "linq";
import { IEnumerable } from "linq";
import { DailySymptoms } from "./DailySymptoms";
import { Symptom } from "./Symptom";
import { Row } from "./types";

export class Symptoms {
	Symptoms: Map<string, Map<LocalDate, DailySymptoms>> = new Map<string, Map<LocalDate, DailySymptoms>>();

	public static Parse(rows: IEnumerable<Row>): Symptoms {
		var symptoms = new Symptoms();
		for (let row of rows.where(row => row.category == "Symptom").toArray()) {
			var symptom = Symptom.Parse(row);
			var timeMap = symptoms.Symptoms.get(symptom.Name);
			if (timeMap === undefined) {
				timeMap = new Map<LocalDate, DailySymptoms>();
				symptoms.Symptoms.set(symptom.Name, timeMap);
			}

			var dailySymptoms = timeMap.get(symptom.Date);
			if (dailySymptoms === undefined) {
				dailySymptoms = new DailySymptoms(symptom);
				timeMap.set(symptom.Date, dailySymptoms);
			}

			dailySymptoms.AddSymptom(symptom);
		}

		for (let symptomsMap of symptoms.Symptoms.values()) {
			for (let dailySymptoms of symptomsMap.values()) {
				dailySymptoms.FillInGaps();
			}
		}

		return symptoms;
	}
}
