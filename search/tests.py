from rest_framework.test import APITestCase
from rest_framework import status

class GithubSearchTest(APITestCase):

    def test_search_users(self):
        response = self.client.post("/api/search/", {
            "query": "john",
            "type": "users"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_query(self):
        response = self.client.post("/api/search/", {
            "query": "ab",
            "type": "users"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
