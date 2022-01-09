import { LocalDate } from "@js-joda/core";
import { DailySymptoms } from "../src/lib/DailySymptoms";
import { Symptom } from "../src/lib/Symptom";

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
});


function getTestSymptom() : Symptom {
	return { Date: LocalDate.of(2021, 5, 13), Name: "TestName" } as Symptom;
}
