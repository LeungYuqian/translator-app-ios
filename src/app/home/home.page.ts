import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonSelect, 
  IonSelectOption, 
  IonTextarea, 
  IonButton, 
  IonIcon, 
  IonSpinner, 
  IonCard, 
  IonCardContent 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { rocket, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonSelect, 
    IonSelectOption, 
    IonTextarea, 
    IonButton, 
    IonIcon, 
    IonSpinner, 
    IonCard, 
    IonCardContent
  ],
})
export class HomePage implements OnInit {
  // 翻译器状态
  sourceLanguage: string = 'zh-CN';
  targetLanguage: string = 'en-US';
  sourceText: string = '';
  targetText: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  
  private debounceTimer: any;

  constructor() {
    // 注册图标
    addIcons({ rocket, alertCircle });
  }

  ngOnInit() {
    this.loadSettings();
  }

  // 获取字符计数
  getCharCount(): number {
    return this.sourceText.length;
  }

  // 源文本变化处理
  onSourceTextChange() {
    // 限制字符数
    if (this.sourceText.length > 500) {
      this.sourceText = this.sourceText.substring(0, 500);
    }
    
    // 清除之前的定时器
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // 设置新的定时器进行自动翻译
    this.debounceTimer = setTimeout(() => {
      this.autoTranslate();
    }, 1000);
    
    this.saveSettings();
  }

  // 自动翻译
  autoTranslate() {
    if (this.sourceText.trim() && this.sourceText.length > 2) {
      this.translate();
    }
  }

  // 交换语言
  swapLanguages() {
    const tempLang = this.sourceLanguage;
    const tempText = this.sourceText;
    
    this.sourceLanguage = this.targetLanguage;
    this.targetLanguage = tempLang;
    this.sourceText = this.targetText;
    this.targetText = tempText;
    
    this.saveSettings();
  }

  // 主翻译功能
  async translate() {
    const text = this.sourceText.trim();
    
    if (!text) {
      this.showError('请输入要翻译的文本');
      return;
    }

    if (this.sourceLanguage === this.targetLanguage) {
      this.showError('源语言和目标语言不能相同');
      return;
    }

    this.isLoading = true;
    this.hideError();

    try {
      const result = await this.callTranslationAPI(text);
      this.targetText = result;
      this.saveSettings();
    } catch (error) {
      console.error('Translation error:', error);
      this.showError('翻译失败，请检查网络连接或稍后重试');
    } finally {
      this.isLoading = false;
    }
  }

  // 调用MyMemory翻译API
  async callTranslationAPI(text: string): Promise<string> {
    const sourceLang = this.sourceLanguage.split('-')[0];
    const targetLang = this.targetLanguage.split('-')[0];
    const langPair = `${sourceLang}|${targetLang}`;
    
    // MyMemory API URL
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}&mt=1`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    } else {
      throw new Error(data.responseDetails || '翻译服务返回错误');
    }
  }

  // 显示错误信息
  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.hideError(), 5000);
  }

  // 隐藏错误信息
  hideError() {
    this.errorMessage = '';
  }

  // 保存设置到本地存储
  saveSettings() {
    const settings = {
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage,
      sourceText: this.sourceText
    };
    localStorage.setItem('translatorSettings', JSON.stringify(settings));
  }

  // 从本地存储加载设置
  loadSettings() {
    const saved = localStorage.getItem('translatorSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.sourceLanguage) this.sourceLanguage = settings.sourceLanguage;
        if (settings.targetLanguage) this.targetLanguage = settings.targetLanguage;
        if (settings.sourceText) this.sourceText = settings.sourceText;
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }
    }
  }
}
