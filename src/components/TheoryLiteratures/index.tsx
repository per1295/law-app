import styles from "./index.module.scss";

import { NowTheory } from "../../contexts";
import { useContext, useMemo, useRef } from "react";
import { shuffle, filterByField } from "../../functions";

import Literature from "../Lirerature";

import type { IProps } from "../Lirerature";

const LITERATURES: Omit<IProps, "zIndex">[] = [
    {
        name: "Сумма теологий",
        writtenDate: "1265-1274",
        theory: "Theological",
        authorID: "1"
    },
    {
        name: "О граде божием",
        writtenDate: "1426",
        theory: "Theological",
        authorID: "2"
    },
    {
        name: "Патриархия",
        writtenDate: "1680",
        theory: "Patriarchal",
        authorID: "3"
    },
    {
        name: "Политика",
        writtenDate: "4 век до н.э.",
        theory: "Patriarchal",
        authorID: "4"
    },
    {
        name: "Что такое прогресс?",
        writtenDate: "1869",
        theory: "Patriarchal",
        authorID: "5"
    },
    // {
    //     name: "Путь к власти",
    //     writtenDate: "1909",
    //     theory: "Violence",
    //     authorID: "6"
    // },
    {
        name: "Ценность жизни",
        writtenDate: "1865",
        theory: "Violence",
        authorID: "7"
    },
    {
        name: "Общее учение о государстве",
        writtenDate: "1892",
        theory: "Violence",
        authorID: "8"
    },
    {
        name: "Теория права и государственной нравственности",
        writtenDate: "1907-1910",
        theory: "Psychological",
        authorID: "9"
    },
    {
        name: "Законы подражания",
        writtenDate: "1890",
        theory: "Psychological",
        authorID: "10"
    },
    // {
    //     name: "Психология масс и анализ человеческого Я",
    //     writtenDate: "1921",
    //     theory: "Psychological",
    //     authorID: "11"
    // },
    // {
    //     name: "Богословно-политический трактат",
    //     writtenDate: "1690",
    //     theory: "Patriarchal",
    //     authorID: "12"
    // },
    {
        name: "Два трактата о правлении",
        writtenDate: "1689",
        theory: "Contractual",
        authorID: "13"
    },
    {
        name: "Об общественном договоре",
        writtenDate: "1762",
        theory: "Contractual",
        authorID: "14"
    },
    {
        name: "Происхождение частой собственности и государства",
        writtenDate: "1884",
        theory: "Materialistic",
        authorID: "15"
    },
];

export default function TheoryLiteratures() {
    const theoryCtx = useContext(NowTheory);

    const items = useMemo(() => {
        const required = filterByField(LITERATURES, "theory", theoryCtx.theory);

        return shuffle(required);
    }, [ theoryCtx.theory ]);

    const zIndex = useRef(2);

    return(
        <div data-literature-container={true} className={styles.theory_literatures}>
            {
                items.map(
                    (literature, index) => (
                        <Literature
                            key={index}
                            name={literature.name}
                            writtenDate={literature.writtenDate}
                            theory={literature.theory}
                            authorID={literature.authorID}
                            zIndex={zIndex}
                        />
                    )
                )
            }
        </div>
    )
}