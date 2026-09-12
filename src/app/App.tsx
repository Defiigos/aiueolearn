import type {ReactNode} from 'react';
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {I18nProvider} from '@/shared/lib/i18n';
import {SoundProvider} from '@/shared/lib/sound';
import {ThemeProvider} from '@/features/theme';
import {ProgressProvider} from '@/entities/progress';
import {AppLayout} from '@/widgets';
import {ReferencePage} from '@/pages/reference/ReferencePage';
import {TrainerPage} from '@/pages/trainer/TrainerPage';

// Базовый путь деплоя на GitHub Pages (проектная страница под /aiueolearn/).
// Должен совпадать с `base` в vite.config.ts и именем репозитория.
const BASE_PATH = '/aiueolearn';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            {index: true, element: <TrainerPage/>},
            {path: 'session', element: <TrainerPage/>},
            {path: 'results', element: <TrainerPage/>},
            {path: 'reference', element: <ReferencePage/>},
            {path: '*', element: <Navigate to="/" replace/>},
        ],
    },
], {basename: BASE_PATH});

/** Корневой компонент приложения с провайдерами и маршрутизацией. */
export function App(): ReactNode {
    return (
        <I18nProvider>
            <ThemeProvider>
                <SoundProvider>
                    <ProgressProvider>
                        <RouterProvider router={router}/>
                    </ProgressProvider>
                </SoundProvider>
            </ThemeProvider>
        </I18nProvider>
    );
}