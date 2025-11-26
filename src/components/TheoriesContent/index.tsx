import styles from "./index.module.scss";

import Statement from "../Statement";
import Person from "../Person";

import { shuffle, filterByField, random, filterWithout } from "../../functions";
import { useRef, useContext, useMemo } from "react";
import { NowTheory } from "../../contexts";

import type { Theory } from "../../types";

interface ITheoriesContentItem {
    type: "statement" | "person";
    theory: Theory;
}

interface IStatement extends ITheoriesContentItem {
    value: string;
}

interface IPerson extends ITheoriesContentItem {
    image: string;
    name: string;
    years: string;
    id: string;
}

const statements: IStatement[] = [
    {
        type: "statement",
        value: "Государство - временное явление: после построения бессклассовго общества оно отомрет как ненужный",
        theory: "Materialistic"
    },
    {
        type: "statement",
        value: "Революция - закономерный способ смены одного типа института государства другим",
        theory: "Materialistic"
    },
    {
        type: "statement",
        value: `
            Естественное состояние - свобода, также хасс, войны и неопределённость, поэтому заключают договор, 
            отказываясь от части свобод в пользу государства, чтобы гарантировать защиту прав и стабильность.
        `,
        theory: "Contractual"
    },
    {
        type: "statement",
        value: "Государство - инструмент общего блага, а не угнетения.",
        theory: "Contractual"
    },
    {
        type: "statement",
        value: "Разделение властей и законы должны ограничивать произвол правителей.",
        theory: "Contractual"
    },
    {
        type: "statement",
        value: `Люди инстинктивно стремятся к подчинению автонитету, так как это снижает тревогу и даёт чувство защищённости.`,
        theory: "Psychological"
    },
    {
        type: "statement",
        value: `Власть правителя (или элиты) опирается на бессознательные механизмы - довение, поклонение силе, поиск отцовской фигуры`,
        theory: "Psychological"
    },
    {
        type: "statement",
        value: `Массовое сознание склонно идеализиовать лидевов, приписьвая им сверхзестественные качества (хавизма, избранность)`,
        theory: "Psychological"
    },
    {
        type: "statement",
        value: `
            Государство - результат военных завоеваний, а не добровольного соглашения.
        `,
        theory: "Violence"
    },
    {
        type: "statement",
        value: `
            Власть основана на силе и принуждении, а не на законе или Божественной воле.
        `,
        theory: "Violence"
    },
    {
        type: "statement",
        value: "Правители устанавливают законы, чтобы укрепить своё господство и предотвратить восстания.",
        theory: "Violence"
    },
    {
        type: "statement",
        value: `Социальное неравенство и классы (рабы, крестьяне, аристократия) следствие завоеваний`,
        theory: "Violence"
    },
    {
        type: "statement",
        value: `Государство - это Большая семья, где правитель играет главы`,
        theory: "Patriarchal"
    },
    {
        type: "statement",
        value: `Власть основана на естественном авторитете старшего`,
        theory: "Patriarchal"
    },
    {
        type: "statement",
        value: `
            Подчинение правителю - естественное продолжение семейной иерархи
        `,
        theory: "Patriarchal"
    },
    {
        type: "statement",
        value: `
            Государственные законы и традиции формируются по аналоги с семейными
        `,
        theory: "Patriarchal"
    },
    {
        type: "statement",
        value: `
            Государство … Божественный институт, а не результат человеческого договора.
        `,
        theory: "Theological"
    },
    {
        type: "statement",
        value: `
            Правитель … наместник Бога на земле, его власть абсолютна и незыблема.
        `,
        theory: "Theological"
    },
    {
        type: "statement",
        value: `Законы и позядок основаны на религиозных нормах (заповеди, шариат).`,
        theory: "Theological"
    },
    {
        type: "statement",
        value: `Критика власти равнозначна греху против Божественной воли.`,
        theory: "Theological"
    },
];

const persons: IPerson[] = [
    {
        type: "person",
        theory: "Psychological",
        image: "image_14",
        name: "Габриэль Тард",
        years: "1843-1904",
        id: "10",
    },
    {
        type: "person",
        theory: "Psychological",
        image: "image_26",
        name: "Лев Петражицкий",
        years: "1907-1910",
        id: "9",
    },
    {
        type: "person",
        theory: "Violence",
        image: "image_27",
        name: "Евгений Дюринг",
        years: "1833-1921",
        id: "7",
    },
    {
        type: "person",
        theory: "Violence",
        image: "image_28",
        name: "Людвиг Гумполович",
        years: "1838-1909",
        id: "8",
    },
    {
        type: "person",
        theory: "Patriarchal",
        image: "image_39",
        name: "Н.К. Михайловский",
        years: "1842-1904",
        id: "5",
    },
    {
        type: "person",
        theory: "Patriarchal",
        image: "image_40",
        name: "Роберт Филмер",
        years: "1588-1653",
        id: "3",
    },
    {
        type: "person",
        theory: "Patriarchal",
        image: "image_41",
        name: "Аристотель",
        years: "4 век до н.э.",
        id: "4",
    },
    {
        type: "person",
        theory: "Theological",
        image: "image_51",
        name: "Аврелий Августин",
        years: "354-430",
        id: "2",
    },
    {
        type: "person",
        theory: "Materialistic",
        image: "image_53",
        name: "Фридрих Энгельс",
        years: "1820-1895",
        id: "15",
    },
    {
        type: "person",
        theory: "Theological",
        image: "image_54",
        name: "Фома аквинский",
        years: "1225-1274",
        id: "1",
    },
    {
        type: "person",
        theory: "Contractual",
        image: "image_12",
        name: "Джон Локк",
        years: "1632-1704",
        id: "13",
    },
    {
        type: "person",
        theory: "Contractual",
        image: "image_1",
        name: "Ж. Ж. Руссо",
        years: "1712-1778",
        id: "14",
    },
];

// statements = shuffle(statements);
// persons = shuffle(persons);

interface IProps {
    contentType: "statements" | "persons";
    order: number;
}

export default function TheoriesContent({ contentType, order }: IProps) {
    const zIndex = useRef(2);
    const { theory } = useContext(NowTheory);

    const items = useMemo(() => {
        let required: (IPerson | IStatement)[];
        let aliens: (IPerson | IStatement)[];

        if ( contentType === "persons" ) {
            required = filterByField(persons, "theory", theory);
            aliens = filterWithout(persons, "theory", theory);
        } else {
            required = filterByField(statements, "theory", theory);
            aliens = filterWithout(statements, "theory", theory);
        }

        const randomIndex1 = random(aliens.length - 1);
        let randomIndex2: number;

        if ( randomIndex1 >= Math.floor(aliens.length / 2) ) {
            randomIndex2 = random(0, randomIndex1 - 1);
        } else {
            randomIndex2 = random(randomIndex1 + 1, aliens.length - 1);
        }

        return shuffle([
            ...required,
            aliens[randomIndex1],
            aliens[randomIndex2]
        ]);
    }, [ theory, contentType ]);

    return(
        <div
            data-statements-container={true}
            data-order-number={order}
            className={styles.theories_content}
        >
            {
                contentType === "persons" ?
                (items as IPerson[]).map((person, index) => (
                    <Person
                        key={index}
                        theory={person.theory}
                        zIndex={zIndex}
                        image={person.image}
                        name={person.name}
                        years={person.years}
                        id={person.id}
                    />
                )) :
                (items as IStatement[]).map((statement, index) => (
                    <Statement
                        key={index}
                        theory={statement.theory}
                        zIndex={zIndex}
                        >
                            {statement.value}
                        </Statement>
                ))
            }
        </div>
    )
}