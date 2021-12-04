import { groupBy } from "lodash";
import { Row } from "../lib/types";
import Day from "./Day"
import classnames from "classnames";

type Props = {
	rows: Row[],
};

export default function EntriesList({ rows }: Props) {
	const byDate = groupBy(rows, (d: Row) => d.date);

	return (
		<div className={classnames("sans-serif", "mw8", "center", "ma4")}>
			{Object.keys(byDate).map((key) => {
				if (key === "date") return;
				return <Day day={key} entries={byDate[key]} />;
			})}
		</div>
	)
}