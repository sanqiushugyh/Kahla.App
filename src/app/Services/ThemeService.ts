import { Injectable, ElementRef } from '@angular/core';
import { AuthApiService } from './AuthApiService';
import { Themes } from '../Models/Themes';
import { KahlaUser } from '../Models/KahlaUser';

@Injectable()
export class ThemeService {

    constructor(
        private authApiService: AuthApiService,
    ) { }

    ApplyThemeFromRemote(elementRef: ElementRef, remoteInfo: KahlaUser) {
        if (this.LocalThemeSetting !== remoteInfo.themeId) {
            this.LocalThemeSetting = remoteInfo.themeId;
        }
        this.ApplyTheme(elementRef, remoteInfo.themeId);
    }

    ApplyThemeFromLocal(elementRef: ElementRef) {
        this.ApplyTheme(elementRef, this.LocalThemeSetting);
    }

    ApplyTheme(elementRef: ElementRef, theme: Themes) {
        switch (theme) {
            case Themes.kahlaDark:
                elementRef.nativeElement.ownerDocument.body.className = 'theme-dark';
                elementRef.nativeElement.ownerDocument.querySelector('meta[name=theme-color]')
                    .setAttribute('content', '#18a4f9');
                break;
            case Themes.sakuraLight:
                elementRef.nativeElement.ownerDocument.body.className = 'theme-sakura-light';
                elementRef.nativeElement.ownerDocument.querySelector('meta[name=theme-color]')
                    .setAttribute('content', '#cf4c78');
                break;
            case Themes.sakuraDark:
                elementRef.nativeElement.ownerDocument.body.className = 'theme-sakura-dark';
                elementRef.nativeElement.ownerDocument.querySelector('meta[name=theme-color]')
                    .setAttribute('content', '#cf4c78');
                break;
            case Themes.violetLight:
                elementRef.nativeElement.ownerDocument.body.className = 'theme-violet-light';
                elementRef.nativeElement.ownerDocument.querySelector('meta[name=theme-color]')
                    .setAttribute('content', '#5F4B8B');
                break;
            case Themes.violetDark:
                elementRef.nativeElement.ownerDocument.body.className = 'theme-violet-dark';
                elementRef.nativeElement.ownerDocument.querySelector('meta[name=theme-color]')
                    .setAttribute('content', '#5F4B8B');
                break;
            case Themes.kahlaLight:
            default:
                elementRef.nativeElement.ownerDocument.body.className = 'theme-light';
                elementRef.nativeElement.ownerDocument.querySelector('meta[name=theme-color]')
                    .setAttribute('content', '#18a4f9');
                break;
        }
    }

    SetRemoteThemeSetting(theme: Themes): void {
        this.authApiService.UpdateClientSetting(theme, null).subscribe();
    }

    get LocalThemeSetting(): Themes {
        const themeSet = localStorage.getItem('setting-theme');
        let theme: Themes;
        if (themeSet == null) {
            theme = Themes.kahlaLight;
        } else {
            theme = parseInt(themeSet, 10) as Themes;
        }
        return theme;
    }

    set LocalThemeSetting(theme: Themes) {
        localStorage.setItem('setting-theme', theme.toString());
    }

}
