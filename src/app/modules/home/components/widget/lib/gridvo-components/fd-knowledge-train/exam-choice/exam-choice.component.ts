import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { KonwgledService } from "../konwgled.service";

@Component({
  selector: "tb-knowledge-exam-choice",
  templateUrl: "./exam-choice.component.html",
  styleUrls: ["./exam-choice.component.scss"],
})
export class ExamChoiceComponent implements OnInit {
  constructor(private kscs: KonwgledService, private cd: ChangeDetectorRef) {}
  answerVisibles: boolean[] = [];
  @Input() title;
  exam = [];
  /**
   * 初始化答案显示，获取excel值
   */
  ngOnInit(): void {
    this.answerVisibles = new Array(506);
    for (let i = 0; i < this.answerVisibles.length; i++) {
      this.answerVisibles[i] = false;
    }
    this.kscs.getExamination().subscribe({
      next: (res) => {
        this.exam = (res as any).items;
        // this.cd.markForCheck();
        // this.cd.detectChanges();
      },
      complete() {},
      error() {},
    });
  }

  answerFormat(val, type) {
    if (type === "CHOICE" && val instanceof Array) {
      const letterArr = new Array(26);
      for (let i = 0; i < letterArr.length; i++) {
        letterArr[i] = String.fromCharCode(i + 65);
      }
      return val.reduce((prev, cur) => {
        return prev + letterArr[cur];
      }, "");
    } else if (type === "JUDGING") {
      return val ? "正确" : "错误";
    } else {
      return val.toString();
    }
  }
  letters(val: number) {
    const letterArr = new Array(26);
    for (let i = 0; i < letterArr.length; i++) {
      letterArr[i] = String.fromCharCode(i + 65);
    }
    return letterArr[val];
  }
  showAnswer(index: number) {
    this.answerVisibles[index] = true;
  }
  identify(_, item) {
    return item.content;
  }
}
