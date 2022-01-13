import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

export function getPaginatedResult<T>(url: string, httpParams: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return http.get<T>(url, { observe: 'response', params: httpParams }).pipe(
        map(response => {
            paginatedResult.result = response.body!;
            if (response.headers.has('Pagination')) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
            }

            return paginatedResult;
        })
    );
}

export function getPaginationHeader(pageNumber: number, pageSize: number) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append("pageNumber", pageNumber.toString())
    httpParams = httpParams.append("pageSize", pageSize.toString())
    return httpParams;
}