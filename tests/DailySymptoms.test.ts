import { LocalDate } from "@js-joda/core";
import Enumerable from "linq";
import { DailySymptoms } from "../src/lib/DailySymptoms";
import { Symptom } from "../src/lib/Symptom";
import { TimeOfDay } from "../src/lib/TimeOfDay";

describe('Constructor', () => {
	test('Initializes date and name from Symptom', () => {
		let symptom = getTestSymptom();

		let dailySymptoms = new DailySymptoms(symptom);

		expect(dailySymptoms.Date).toBe(symptom.Date);
		expect(dailySymptoms.Name).toBe(symptom.Name);
	});

	test('Leaves Symptoms array empty', () => {
		let symptom = getTestSymptom();

		let dailySymptoms = new DailySymptoms(symptom);

		expect(dailySymptoms.Symptoms.length).toBe(0);
	});
});

describe('AddSymptom', () => {
	test.each([
		["different name", (symptom: Symptom) => { return { ...symptom, Name: symptom.Name + "a" } as Symptom }],
		["different date", (symptom: Symptom) => { return { ...symptom, Date: symptom.Date.plusDays(1) } }],
	])('For symptom with %s from the initial, throws error', (_, getDifferentSymptom: (s: Symptom) => Symptom)  => {
		let firstSymptom = getTestSymptom();
		let dailySymptoms = new DailySymptoms(firstSymptom);
		let secondSymptom = getDifferentSymptom(firstSymptom);

		expect(() => dailySymptoms.AddSymptom(secondSymptom)).toThrow();
	});

	test('For symptom with same name and date, adds symptom', () => {
		var firstSymptom = getTestSymptom();
		var secondSymptom = getTestSymptom();
		let dailySymptoms = new DailySymptoms(firstSymptom);
		dailySymptoms.AddSymptom(firstSymptom);

		dailySymptoms.AddSymptom(secondSymptom);

		expect(dailySymptoms.Symptoms).toIncludeSameMembers([firstSymptom, secondSymptom]);
	});
});

describe('FillInGaps', () => {
	test('With missing AM symptom, inserts AM symptom', () => {
		let symptoms = [getTestSymptom(TimeOfDay.Pre), getTestSymptom(TimeOfDay.Mid), getTestSymptom(TimeOfDay.PM)];
		let dailySymptoms = new DailySymptoms(symptoms[0]);
		for (let symptom of symptoms) {
			dailySymptoms.AddSymptom(symptom);
		}

		dailySymptoms.FillInGaps();

		let amSymptom = Enumerable.from(dailySymptoms.Symptoms).firstOrDefault(s => s.TimeOfDay == TimeOfDay.AM);
		expect(amSymptom).toBeDefined();
	});
})


function getTestSymptom(timeOfDay: TimeOfDay | undefined = undefined) : Symptom {
	return { Date: LocalDate.of(2021, 5, 13), Name: "TestName", TimeOfDay: timeOfDay } as Symptom;
}
