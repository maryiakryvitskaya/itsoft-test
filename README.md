# Search Application with NgRx Store

This project implements a search functionality with NgRx for managing the state of the application. It allows users to search books using a public API, store recent queries in the application state, and display search results with pagination and suggestions.

## Assignment Details

### 1. Project Setup:

- [x] Start a new Angular project.
- [x] Select any public API that supports text-based queries.

### 2. Feature Implementation:

- [x] **Typeahead Search**: Develop a typeahead search with optimizations such as debounce and switchMap.
- [x] **Batch-based Pagination**: Render results using a virtual scroller with batch-based pagination.
- [x] **NgRx Store**: Save typeahead queries in the store, optimized to include only meaningful queries (e.g., those triggering results).
- [x] **Search Suggestions**: Suggest past queries from the store for subsequent searches, with optimizations like word breakdown.

### 3. Code Expectations:

- [x] Use NgRx store actions, effects, reducers, and selectors to manage the application state.
- [x] Incorporate services and interceptors where needed.

## Features

- **Search Functionality**: The user can search for books based on the query entered.
- **Suggestions**: The application shows past search queries as suggestions when typing in the search box.
- **Pagination**: Results are paginated, and more results are loaded as the user scrolls.
- **State Management**: NgRx is used to manage the application state, including past queries and search results.
- **API Integration**: The application integrates with the [ItBook API](https://api.itbook.store/) for fetching book data.

## Technologies Used

- **Angular**: Frontend framework for building the web application.
- **NgRx**: State management library for managing the application's state.
- **RxJS**: Library for handling asynchronous events and data streams.
- **Bootstrap**: CSS framework for styling the application.

## Setup and Installation

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Steps to run the application locally

1. Clone the repository:

   git clone <repository-url>
   cd <project-folder>

2. Install the dependencies:

   npm install

3. Run the application:

   ng serve

4. Open the application in your browser:

   http://localhost:4200