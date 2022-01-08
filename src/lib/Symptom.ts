import { DateTimeFormatter, LocalDate } from "@js-joda/core";
import { Locale } from "@js-joda/locale";
import { TimeOfDay } from "./TimeOfDay";
import { Row } from "./types";

export class Symptom {
	readonly Name: string;
	readonly Date: LocalDate;
	readonly TimeOfDay: TimeOfDay;
	readonly Severity: number;

	private constructor(name: string, date: LocalDate, timeOfDay: TimeOfDay, severity: number) {
		this.Name = name;
		this.Date = date;
		this.TimeOfDay = timeOfDay;
		this.Severity = severity;
	}

	public static Parse(row: Row) : Symptom {
		//Well, apparently empty and none (0) are both exported the same way - by not being exported at all.
		//So unless I fill in the gaps and assume all missing data is 0, the data is going to be quite bad.
		//This is valid for me, as I think I'm 100% for filling out data (or nearly), but may cause others trouble
		//Maybe also means data structure could/should change... DailySymptoms?
		let name = this.GetSymptomName(row.detail);
		let date = this.ParseDate(row.date);
		let timeOfDay = this.ParseTimeOfDay(row.time_of_day);
		let severity = parseInt(row.rating_or_amount);
		return new Symptom(name, date, timeOfDay, severity);
	}

	public static CreateFiller(name: string, date: LocalDate, timeOfDay: TimeOfDay): Symptom {
		return new Symptom(name, date, timeOfDay, 0);
	}

	private static GetSymptomName(symptomDetails: string): string {
		var regex: RegExp = /(.*)( \(.*\))/;
		var symptomName = regex.exec(symptomDetails)?.[1];
		if (symptomName === undefined) throw new Error("Failed to parse name of symptom in " + symptomDetails);
		return symptomName;
	}

	private static ParseTimeOfDay(timeOfDay: string): TimeOfDay {
		switch (timeOfDay) {
			case "pre":
				return TimeOfDay.Pre;
			case "am":
				return TimeOfDay.AM;
			case "mid":
				return TimeOfDay.Mid;
			case "pm":
				return TimeOfDay.PM;
		}

		throw new Error("Failed to parse TimeOfDay " + timeOfDay);
	}

	private static ParseDate(date: string): LocalDate {
		var regex: RegExp = /(\d*)(\w*) (\w\w\w) (\d\d\d\d)/;
		var matchArray = regex.exec(date);
		if (matchArray === null) throw new Error("Failed to parse date of " + date);

		var day = parseInt(matchArray[1]);
		var month = matchArray[3];
		var year = parseInt(matchArray[4]);

		let formatter = DateTimeFormatter.ofPattern('yyyy MMM d').withLocale(Locale.US);
		return LocalDate.parse(`${year} ${month} ${day}`, formatter);
	}
}
