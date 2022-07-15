import { Injectable } from "@angular/core";
import { Theme, themeList } from "@home/components/widget/lib/gridvo-components/theme";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private active: Theme = this.getTheme(localStorage.getItem('themeValue'))
  private availableThemes: Theme[] = themeList;

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  isDarkTheme(): boolean {
    return this.active.name === themeList[1].name;
  }
  getTheme(val: string): Theme {
    return themeList.filter(item => item.name === val)[0]
  }
  setActiveTheme(theme: string): void {
    this.active = this.getTheme(theme)
    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });

    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('data-theme-style', theme); // 设置data-theme-style 属性
  }
}
