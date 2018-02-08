const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../server');
const promClient = require('../../app/lib/promBundle').promClient;

const expect = chai.expect;

chai.use(chaiHttp);

describe('metrics end point', () => {
  let responseText;

  before('make request to /metrics endpoint', async () => {
    const res = await chai.request(app).get('/metrics');
    expect(res).to.have.status(200);
    responseText = res.text;
  });

  it('should return an up gauge', () => {
    expect(responseText).to.have.string('# HELP up 1 = up, 0 = not up\n# TYPE up gauge');
  });

  it('should return an app_starts counter', () => {
    expect(responseText).to.have.string('# HELP app_starts The number of times the application has been started\n# TYPE app_starts counter');
  });

  it('should return a The number of zero pharmacy results views counter', () => {
    expect(responseText).to.have.string('# HELP zero_pharmacy_results_views The number of zero pharmacy results page views\n# TYPE zero_pharmacy_results_views counter');
  });

  it('should return a The number of zero place results views counter', () => {
    expect(responseText).to.have.string('# HELP zero_place_results_views The number of zero place results page views\n# TYPE zero_place_results_views counter');
  });

  it('should return a The number of zero postcode results views counter', () => {
    expect(responseText).to.have.string('# HELP zero_postcode_results_views The number of zero postcode results page views\n# TYPE zero_postcode_results_views counter');
  });

  it('should return a place disambiguation views counter', () => {
    expect(responseText).to.have.string('# HELP place_disambiguation_views The number of place disambiguation page views\n# TYPE place_disambiguation_views counter');
  });

  it('should return an error_page_views counter', () => {
    expect(responseText).to.have.string('# HELP error_page_views The number of error page views\n# TYPE error_page_views counter');
  });

  it('should return an english_my_location_searches counter', () => {
    expect(responseText).to.have.string('# HELP english_my_location_searches The number of my location searches in England\n# TYPE english_my_location_searches counter');
  });

  it('should return a known_but_not_english_my_location_searches counter', () => {
    expect(responseText).to.have.string('# HELP known_but_not_english_my_location_searches The number of my location searches in an area that is known but is not in England\n# TYPE known_but_not_english_my_location_searches counter');
  });

  it('should return an out_of_area_my_location_searches counter', () => {
    expect(responseText).to.have.string('# HELP out_of_area_my_location_searches The number of my location searches in an unsupported area\n# TYPE out_of_area_my_location_searches counter');
  });

  it('should return a results_check counter', () => {
    expect(responseText).to.have.string('# HELP results_check The number of checks against the results page\n# TYPE results_check counter');
  });

  it('should return a search_check counter', () => {
    expect(responseText).to.have.string('# HELP search_check The number of checks against the search page\n# TYPE search_check counter');
  });

  it('should return a histogram for get_nearby_services timings', () => {
    expect(responseText).to.have.string('# HELP get_nearby_services Duration histogram of request to nearby-services-api\n# TYPE get_nearby_services histogram');
  });

  it('should return a histogram for get_postcodes_io_postcode timings', () => {
    expect(responseText).to.have.string('# HELP get_postcodes_io_postcode Duration histogram of request to postcodes.io for postcode lookup\n# TYPE get_postcodes_io_postcode histogram');
  });

  it('should return a histogram for get_postcodes_io_place timings', () => {
    expect(responseText).to.have.string('# HELP get_postcodes_io_place Duration histogram of request to postcodes.io for place lookup\n# TYPE get_postcodes_io_place histogram');
  });

  it('should return a histogram for get_postcodes_io_reverse_geocode timings', () => {
    expect(responseText).to.have.string('# HELP get_postcodes_io_reverse_geocode Duration histogram of request to postcodes.io for reverse geocode lookup\n# TYPE get_postcodes_io_reverse_geocode histogram');
  });

  it('should return an http_request_duration_seconds histogram', () => {
    expect(responseText).to.have.string('# HELP http_request_duration_seconds duration histogram of http responses labeled with: status_code, path\n# TYPE http_request_duration_seconds histogram');
  });

  it('should return an the default metrics', () => {
    expect(responseText).to.have.string('# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.\n# TYPE process_cpu_user_seconds_total counter');
    expect(responseText).to.have.string('# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds.\n# TYPE process_cpu_system_seconds_total counter');
    expect(responseText).to.have.string('# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.\n# TYPE process_cpu_seconds_total counter');
    expect(responseText).to.have.string('# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.\n# TYPE process_start_time_seconds gauge');
    expect(responseText).to.have.string('# HELP process_resident_memory_bytes Resident memory size in bytes.\n# TYPE process_resident_memory_bytes gauge');
    expect(responseText).to.have.string('# HELP process_virtual_memory_bytes Virtual memory size in bytes.\n# TYPE process_virtual_memory_bytes gauge');
    expect(responseText).to.have.string('# HELP process_heap_bytes Process heap size in bytes.\n# TYPE process_heap_bytes gauge');
    expect(responseText).to.have.string('# HELP process_open_fds Number of open file descriptors.\n# TYPE process_open_fds gauge');
    expect(responseText).to.have.string('# HELP process_max_fds Maximum number of open file descriptors.\n# TYPE process_max_fds gauge');
    expect(responseText).to.have.string('# HELP nodejs_eventloop_lag_seconds Lag of event loop in seconds.\n# TYPE nodejs_eventloop_lag_seconds gauge');
    expect(responseText).to.have.string('# HELP nodejs_active_handles_total Number of active handles.\n# TYPE nodejs_active_handles_total gauge');
    expect(responseText).to.have.string('# HELP nodejs_active_requests_total Number of active requests.\n# TYPE nodejs_active_requests_total gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_size_total_bytes Process heap size from node.js in bytes.\n# TYPE nodejs_heap_size_total_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_size_used_bytes Process heap size used from node.js in bytes.\n# TYPE nodejs_heap_size_used_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_external_memory_bytes Nodejs external memory size in bytes.\n# TYPE nodejs_external_memory_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_space_size_total_bytes Process heap space size total from node.js in bytes.\n# TYPE nodejs_heap_space_size_total_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_space_size_used_bytes Process heap space size used from node.js in bytes.\n# TYPE nodejs_heap_space_size_used_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_space_size_available_bytes Process heap space size available from node.js in bytes.\n# TYPE nodejs_heap_space_size_available_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_version_info Node.js version info.\n# TYPE nodejs_version_info gauge');
  });

  afterEach('clear metrics', () => {
    // Clear the metrics created when the app starts to avoid reports of:
    // Error: A metric with the name up has already been registered.
    promClient.register.clear();
  });
});
