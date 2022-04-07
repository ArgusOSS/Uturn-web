import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {DataService} from "../../../app/utils/data.service";

@Component({
  selector: 'ngx-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss'],
})
export class TypeAheadComponent implements OnInit, OnDestroy {
  searchFailed: boolean = true;
  data: any[] = [];
  dataLoading = false;
  spinner: boolean = false;
  dataInput$ = new Subject<string>();
  term: string = '';

  @Input() model: any;
  @Input() disabled: boolean = false;
  @Input() filters: any;
  @Input() required = true;
  @Input() searchField: string = '';
  @Input() placeholder: string = 'Search here';
  @Input() url: string = '';
  @Input() value: string = '';
  @Input() minTermLength: number = 3;
  @Input() notifySearchFail: boolean = false;
  @Input() displayNames: string[] = [];
  @Output() send: EventEmitter<any> = new EventEmitter();
  @Output() failed: EventEmitter<{ error: any | null, term: string }> = new EventEmitter();

  // @ViewChild('instance', {static: true}) instance: NgbTypeahead;

  sub: Subscription = <Subscription>{};

  constructor(private http: DataService, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    try {
      this.sub.unsubscribe();
      this.dataInput$.unsubscribe();
    } catch (e) {

    }

  }

  async searchApi(event: string): Promise<any[]> {

    const query: any = {};
    if (this.searchField) {
      query[this.searchField] = event;
    }
    query['__limit'] = 100;
    for (const i in this.filters) {
      if (this.filters.hasOwnProperty(i)) {
        query[i] = this.filters[i];
      }
    }

    return (await this.http.query(query, this.url)).data;
  }

  emitSelected(event: string) {
    if (typeof event === typeof 'str') {
      this.failed.emit({error: null, term: event});
      return;
    }
    this.send.emit(event);
    this.searchFailed = true;
  }

  selectAll() {
    this.spinner = true;
    this.data.forEach(async (r: undefined | any) => {
      this.send.emit(r);
      await this.delay(500);
    });
    this.spinner = false;
  }

  async delay(ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

  resultFormatter(x: any) {
    if (x && this.displayNames && this.displayNames.length) {
      return this.displayNames.map(d => x[d]).join(', ');
    }
    if (!x || !x.name) {
      return;
    }
    if (x.hasOwnProperty('phone') && x.phone) {
      return x.name + ' - ' + x.phone;
    }
    return x.name;
  }

  async loadPeople() {
    try {
      this.sub.unsubscribe();
      // this.data$ = this.searchApi(undefined);
    } catch (e) {
    }
    this.sub = this.dataInput$.pipe(
      debounceTime(500),
      distinctUntilChanged((current: string, previous: string) => current === previous),
      tap(() => {
        this.dataLoading = true;
      }),
      map(async (term: string) => {
        if (!term) {
          return;
        }
        this.spinner = true;
        this.term = term;
        try {
          return await this.searchApi(term);
        } catch (e) {
          this.failed.emit({error: e, term: this.term});
          return;

        }

      })).subscribe(async res => {
      // @ts-ignore
      this.data = await res;
      const result = await res;
      if (result && result.length === 0) {
        this.failed.emit({error: null, term: this.term});
      }
      this.spinner = false;
      this.dataLoading = false;
      this.cd.detectChanges();
    }, (e) => {
      this.failed.emit({error: e, term: this.term});
    });
  }

}
