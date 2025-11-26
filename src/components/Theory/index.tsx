import styles from "./index.module.scss";

import type { WithChildren } from "../../types";
import { ThemeContext, ScoreContext } from "../../contexts";
import { useContext } from "react";
import { useRandomID } from "../../hooks";

import TheoryLabel from "../TheoryLabel";
import TheoryContainer from "../TheoryContainer";
import TheoryLiteratures from "../TheoryLiteratures";

interface IProps {
    theory_value: string;
    theory_name: string;
}

export default function Theory({children, theory_name, theory_value}: WithChildren<IProps>) {
    const theme = useContext(ThemeContext);
    const className = `${styles.theory} ${theme.value === "dark" || styles.theory_light}`;

    const { score } = useContext(ScoreContext);
    const randomId = useRandomID([score.access, score.total], () => {
        return score.access && score.total && score.access === score.total;
    });

    return(
        <section className={className}>
            {children}
            <TheoryLabel label={theory_name}/>
            <TheoryLiteratures key={randomId} />
            <TheoryContainer theory_value={theory_value}/>
        </section>
    )
}