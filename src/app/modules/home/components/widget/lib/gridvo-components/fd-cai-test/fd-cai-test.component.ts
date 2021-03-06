import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, Injectable, OnInit } from "@angular/core";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { Observable } from "rxjs";

interface RandomUser {
  gender: string;
  email: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
}

@Injectable({ providedIn: "root" })
export class RandomUserService {
  randomUserUrl = "https://api.rand omuser.me/";

  getUsers(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<{ results: RandomUser[] }> {
    let params = new HttpParams()
      .append("page", `${pageIndex}`)
      .append("results", `${pageSize}`)
      .append("sortField", `${sortField}`)
      .append("sortOrder", `${sortOrder}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
    return this.http.get<{ results: RandomUser[] }>(`${this.randomUserUrl}`, {
      params,
    });
  }

  constructor(private http: HttpClient) {}
}

@Component({
  selector: "tb-fd-cai-test",
  templateUrl: "./fd-cai-test.component.html",
  styleUrls: ["./fd-cai-test.component.scss"],
})
export class FdCaiTestComponent implements OnInit {
  total = 1;
  listOfRandomUser: RandomUser[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.randomUserService
      .getUsers(pageIndex, pageSize, sortField, sortOrder, filter)
      .subscribe((data) => {
        // console.log(data);
        this.loading = false;
        this.total = 200; // mock the total data here
        this.listOfRandomUser = data.results;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  constructor(private randomUserService: RandomUserService) {}

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
    console.log("hello world");
  }
}
