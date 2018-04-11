from selenium import webdriver

driver = webdriver.Chrome('chromedriver')  # Optional argument, if not specified will search path.
driver2 = webdriver.Chrome('chromedriver')
search_terms = ['nba', 'mma']

for search_term in search_terms:
    base_url = 'https://twitter.com/search?q=' + search_term + '&src=typd&lang=en'
    print(base_url)
    driver.get(base_url)
    items = driver.find_elements_by_class_name("stream-item-header")
    for tweet in items:
        try:
            user_url = tweet.find_element_by_tag_name("a").get_attribute('href')
            print(user_url)
            driver2.get(user_url)
            key_metrics_divs = driver2.find_element_by_class_name('ProfileNav-list')
            key_metrics = key_metrics_divs.find_elements_by_tag_name("a")
            for key_metric in key_metrics:
                metric_value = key_metric.get_attribute('title')
                print(metric_value)
            print('----')
        except Exception as e:
            print(e)
            print('----')
    print(len(items))
    driver.quit()
    driver2.quit()
