import { Symptom } from "../src/lib/Symptom";
import { TimeOfDay } from "../src/lib/TimeOfDay";
import { Row } from "../src/lib/types"

it('Can Parse Row into Symptom', () => {
	var row = { 
		date: "30th Nov 2021",
		weekday: "Tuesday",
		time_of_day: "am",
		category: "Symptom",
		rating_or_amount: "1",
		detail: "Back (lower) pain (Mild)",
		notes: ""
	} as Row;
	let parsed = Symptom.Parse(row);

	let expected = {
		Name: "Back (lower) pain",
		TimeOfDay: TimeOfDay.AM,
		Severity: 1
	} as Symptom;

	expect(parsed).toMatchObject(expected)
	expect(parsed.Date.year()).toEqual(2021);
	expect(parsed.Date.monthValue()).toEqual(11);
	expect(parsed.Date.dayOfMonth()).toEqual(30);
})