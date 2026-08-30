import {useProgressContext} from './ProgressContext';

/** Хук доступа к прогрессу и методам его обновления. */
export function useProgress(): ReturnType<typeof useProgressContext> {
    return useProgressContext();
}