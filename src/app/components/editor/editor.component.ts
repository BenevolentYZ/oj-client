import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../services/data.service';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;
  sessionId: string;
  output: string = '';
  public languages: string[] = ['Java', 'Python'];

  language: string = 'Java';

  defaultContent = {
    'Java': `public class Example {
      public static void main(String[] args) {
        //Type your Java code here
      }
    }`,
    'Python': `class Solution:
      def example():
      #write your Python code here`
  };

  constructor(private collaboration: CollaborationService,
              private route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
      })
      this.collaboration.restoreBuffer();
  }

  initEditor(): void{
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();
    document.getElementsByTagName('textarea')[0].focus();

    //set up collaboration socket
    this.collaboration.init(this.editor, this.sessionId);

    this.editor.lastAppliedChange = null;

    //register change callback
    this.editor.on('change', (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    })
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/' + this.language.toLowerCase());
    this.editor.setValue(this.defaultContent[this.language]);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  submit(): void {
    let usercode = this.editor.getValue();
    console.log(usercode);

    const data = {
      code: usercode,
      lang: this.language.toLowerCase()
    }
    this.dataService.buildAndRun(data).then(res => this.output = res);
  }
}
