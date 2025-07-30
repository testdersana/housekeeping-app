import requests
import time
import statistics

def test_api_performance(url, num_requests=10):
    times = []
    
    print(f"Testing API performance for {url}")
    print(f"Making {num_requests} requests...")
    
    for i in range(num_requests):
        start_time = time.time()
        try:
            response = requests.get(url)
            if response.status_code == 200:
                status = "Success"
            else:
                status = f"Error: {response.status_code}"
        except Exception as e:
            status = f"Exception: {str(e)}"
            
        end_time = time.time()
        elapsed_time = (end_time - start_time) * 1000  # Convert to milliseconds
        times.append(elapsed_time)
        
        print(f"Request {i+1}: {status} - {elapsed_time:.2f}ms")
    
    if times:
        avg_time = statistics.mean(times)
        min_time = min(times)
        max_time = max(times)
        median_time = statistics.median(times)
        
        print("\nPerformance Summary:")
        print(f"Average response time: {avg_time:.2f}ms")
        print(f"Minimum response time: {min_time:.2f}ms")
        print(f"Maximum response time: {max_time:.2f}ms")
        print(f"Median response time: {median_time:.2f}ms")
    else:
        print("No successful requests to calculate performance metrics.")

if __name__ == "__main__":
    api_url = "https://work-1-atyptzudlngdzgey.prod-runtime.all-hands.dev/api/hotels/"
    test_api_performance(api_url, 5)