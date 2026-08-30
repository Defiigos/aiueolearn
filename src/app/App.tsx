import type {ReactNode} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {I18nProvider} from '@/shared/lib/i18n';
import {ThemeProvider} from '@/features/theme';
import {ProgressProvider} from '@/entities/progress';
import {AppLayout} from '@/widgets';
import {ReferencePage} from '@/pages/reference/ReferencePage';
import {TrainerPage} from '@/pages/trainer/TrainerPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            {index: true, element: <TrainerPage/>},
            {path: 'reference', element: <ReferencePage/>},
        ],
    },
]);

/** Корневой компонент приложения с провайдерами и маршрутизацией. */
export function App(): ReactNode {
    return (
        <I18nProvider>
            <ThemeProvider>
                <ProgressProvider>
                    <RouterProvider router={router}/>
                </ProgressProvider>
            </ThemeProvider>
        </I18nProvider>
    );
}