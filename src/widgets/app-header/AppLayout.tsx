import type {ReactNode} from 'react';
import {NavLink, Outlet} from 'react-router-dom';
import {LanguageToggle} from '@/features/i18n';
import {ThemeToggle} from '@/features/theme';
import {useI18n} from '@/shared/lib/i18n';
import {cx} from '@/shared/lib/cx';
import styles from './AppLayout.module.css';

/** Шапка приложения: логотип, навигация и переключатели темы и языка. */
export function AppHeader(): ReactNode {
    const {t} = useI18n();

    const navLinks = [
        {to: '/', label: t('nav.trainer')},
        {to: '/reference', label: t('nav.reference')},
    ] as const;

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <NavLink to="/" className={styles.brand}>
                    <span className={styles.brandMark}>あ</span>
                    <span className={styles.brandName}>AIUEO Learn</span>
                </NavLink>
                <nav className={styles.nav} aria-label={t('nav.aria')}>
                    {navLinks.map(({to, label}) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({isActive}) => cx(styles.link, isActive && styles.active)}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <LanguageToggle/>
                <ThemeToggle/>
            </div>
        </header>
    );
}

/** Каркас страницы: шапка и центральная колонка с контентом дочернего маршрута. */
export function AppLayout(): ReactNode {
    return (
        <div className={styles.shell}>
            <AppHeader/>
            <main className={styles.main}>
                <Outlet/>
            </main>
        </div>
    );
}