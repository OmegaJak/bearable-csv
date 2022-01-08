import { LocalDate } from "@js-joda/core";
import Enumerable from "linq";
import { fill } from "lodash";
import { start } from "repl";
import { Symptom } from "./Symptom";
import { TimeOfDay } from "./TimeOfDay";


export class DailySymptoms {
	Symptoms: Symptom[];
	Date: LocalDate;
	Name: string;

	public constructor(startingSymptom: Symptom) {
		this.Date = startingSymptom.Date;
		this.Name = startingSymptom.Name;
	}

	public AddSymptom(symptom: Symptom) {
		if (symptom.Date != this.Date) throw new Error("Date didn't match");
		if (symptom.Name != this.Name) throw new Error("Name didn't match");

		this.Symptoms.push(symptom);
	}

	public FillInGaps() {
		var expectedSymptomTimes = [TimeOfDay.Pre, TimeOfDay.AM, TimeOfDay.Mid, TimeOfDay.PM];
		for (let expectedSymptomTime of expectedSymptomTimes) {
			if (!Enumerable.from(this.Symptoms).any(s => s.TimeOfDay == expectedSymptomTime)) {
				let fillerSymptom = Symptom.CreateFiller(this.Name, this.Date, expectedSymptomTime);
				this.Symptoms.push(fillerSymptom);
			}
		}
	}
}
