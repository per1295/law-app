import styles from "./index.module.scss";

import Theories from "../Theories";
import TheoriesContent from "../TheoriesContent";
import ProgressBar from "../ProgressBar";

import { ScoreContext, ThemeContext, NowTheory } from "../../contexts";
import { useContext, useRef, useEffect, useEffectEvent, useState } from "react";
import { useRandomID } from "../../hooks";

import type { INowTheory, Theory } from "../../types";
import type { Dispatch, SetStateAction } from "react";

const THEORIES_VALUES: Theory[] = [
    "Theological",
    "Patriarchal",
    "Violence",
    "Psychological",
    "Contractual",
    "Materialistic",
];

interface IProps {
    setShownScore: Dispatch<SetStateAction<boolean>>;
}

export default function Desk({setShownScore}: IProps) {
    const theme = useContext(ThemeContext);
    const { score, setScore } = useContext(ScoreContext);
    const className = `${styles.deskboard} ${theme.value === "dark" || styles.deskboard_light}`;
    const desk_ref = useRef<HTMLElement>(null);

    const [nowTheory, setNowTheory] = useState<Omit<INowTheory, "setValue">>({theory: "Theological", index: 0});
    const now_theory_ctx: INowTheory = { theory: nowTheory.theory, index: nowTheory.index, setValue: setNowTheory };

    const [ isContentsEmpty, setIsContentsEmpty ] = useState({
        first: false,
        second: false
    });

    const zeroAccessHandler = useEffectEvent(() => {
        if ( score.access === null ) {
            setScore(s => ({ ...s, access: 0 }));
        }
    });

    // Подсчет возможного количества очков
    useEffect(() => {
        const desk = desk_ref.current as HTMLElement;
        const theories_contents = desk.lastElementChild?.children as HTMLCollectionOf<HTMLDivElement>;
        const theory_literatures = document.querySelector("[data-literature-container]") as HTMLDivElement;
        const theory_literatures_items = theory_literatures?.children as HTMLCollectionOf<HTMLDivElement>;

        const theory = nowTheory.theory.toLowerCase();

        for ( const theory_content of theories_contents ) {
            for ( const statement of theory_content.children as HTMLCollectionOf<HTMLDivElement> ) {
                const statement_theory = statement.dataset.theory?.toLowerCase();

                if ( theory === statement_theory ) {
                    setScore(prev => ({...prev, total: (prev.total ?? 0) + 1}));
                }
            }
        }

        setScore(prev =>
            ({...prev, total: (prev.total ?? 0) + theory_literatures_items.length})
        );

        return () => {
            setScore({ total: null, access: null });
        }
    }, [nowTheory, setScore]);

    useEffect(() => {
        const desk = desk_ref.current as HTMLElement;
        const theory_section = desk.firstElementChild?.querySelector("[data-container]") as HTMLElement;

        // Реагирование на правильно заполение контейнера
        if ( score.total && score.access && score.access === score.total ) {
            setNowTheory(prev => {
                const newIndex = prev.index + 1;

                return({
                    index: newIndex,
                    theory: THEORIES_VALUES[newIndex]
                })
            });

            // Очистка содержимого контейнера
            for ( const trash of theory_section.children as HTMLCollectionOf<HTMLDivElement>) {
                trash.dataset.trash = "true";
                setTimeout(() => trash.remove());
            }
        }
    }, [score.access, score.total, setShownScore]);

    const randomId = useRandomID([score.access, score.total], () => {
        return score.access && score.total && score.access === score.total;
    });

    // Окончание игры и показ результатов
    useEffect(() => {
        if ( nowTheory.index === THEORIES_VALUES.length ) {
                setShownScore(true);
                return;
            }
    }, [nowTheory.index, setShownScore]);

    useEffect(() => {
        const isEmpty = isContentsEmpty.first && isContentsEmpty.second;
        const desk = desk_ref.current as HTMLElement;
        const theory_section = desk.firstElementChild?.querySelector("[data-container]") as HTMLElement;

        // Реагирование на неправильное заполнение контейнера
        if ( score.access !== score.total && isEmpty ) {
            theory_section.classList.add(styles.theory_section_fail);
        } else {
            theory_section.classList.remove(styles.theory_section_fail);
        }

        
    }, [isContentsEmpty.first, isContentsEmpty.second, score.access, score.total]);

    // Реагирование на добавление в контейнер новых карточек
    useEffect(() => {
        const desk = desk_ref.current as HTMLElement;
        const theory = desk.firstElementChild as HTMLDivElement;
        const theories_contents = desk.lastElementChild?.children as HTMLCollectionOf<HTMLDivElement>;

        const observer = new MutationObserver((records) => {
            for ( const record of records ) {
                const container = record.target as HTMLDivElement;

                // Для добавленных узлов
                for ( const statement of record.addedNodes ) {
                    const s = statement as HTMLDivElement;

                    const statement_theory = s.dataset.theory?.toLowerCase();
                    const conteineiner_theory = container.dataset.theory?.toLowerCase();

                    if ( s.dataset.literature ) {
                        const prevElem = s.previousElementSibling as HTMLElement;
                        if ( !prevElem ) return;

                        const literature_id = s.dataset.author as string;
                        const author_id_prev = prevElem.dataset.id;

                        if ( literature_id === author_id_prev ) {
                            setScore(score => ({...score, access: (score.access ?? 0) + 1}));
                            s.dataset.approved = "true";
                        }
                    } else {
                        if ( statement_theory === conteineiner_theory ) {
                            setScore(score => ({...score, access: (score.access ?? 0) + 1}));
                        } else {
                            setScore(score => ({...score, access: (score.access ?? 0) - 1}));
                        }
                    }
                }

                // Для удаляемых узлов
                for ( const statement of record.removedNodes ) {
                    const s = statement as HTMLDivElement;
                    
                    if ( s.dataset.trash ) return;

                    const statement_theory = s.dataset.theory?.toLowerCase();
                    const conteineiner_theory = container.dataset.theory?.toLowerCase();

                    if ( s.dataset.literature ) {
                        const wasApproved = s.dataset.approved;
                        if ( !wasApproved ) return;

                        setScore(score => ({...score, access: (score.access ?? 0) - 1}));
                        s.dataset.approved = "";
                    } else {
                        if ( statement_theory === conteineiner_theory ) {
                            setScore(score => ({...score, access: (score.access ?? 0) - 1}));
                        } else {
                            setScore(score => ({...score, access: (score.access ?? 0) + 1}));
                        }
                    }
                }


                if ( !theories_contents[0].children.length ) {
                    setIsContentsEmpty(
                        prev => ({...prev, first: true})
                    );
                } else {
                    setIsContentsEmpty(
                        prev => ({...prev, first: false})
                    );
                }
                    
                if ( !theories_contents[1].children.length ) {
                    setIsContentsEmpty(
                        prev => ({...prev, second: true})
                    );
                } else {
                    setIsContentsEmpty(
                        prev => ({...prev, second: false})
                    );
                }
            }
        });

        const theory_container = theory.querySelector("[data-container]") as HTMLDivElement;
        observer.observe(theory_container, {childList: true});

        return () => {
            observer.disconnect();
        }
    }, [setScore, zeroAccessHandler]);

    return(
        <main ref={desk_ref} className={className}>
            <NowTheory.Provider value={now_theory_ctx}>
                <Theories />
                <div className={styles.deskboard_theories_contents}>
                    <TheoriesContent key={randomId} contentType="persons" order={1} />
                    <TheoriesContent key={randomId + 1} contentType="statements" order={2} />
                </div>
                <ProgressBar total={THEORIES_VALUES.length} now_index={nowTheory.index}/>
            </NowTheory.Provider>
        </main>
    )
}