setup: env install

env:
	cp .env.example.env .env

install:
	npm install

generate_key:
	openssl genpkey -algorithm ed25519 -out private.pem
	openssl pkey -in private.pem -pubout -out public.pem

report:
	open out/test-report.html

clean:
	rm -f ./out/test.log 
	rm -f ./out/test-report.html
