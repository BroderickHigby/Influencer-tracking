FROM python:3.5

RUN mkdir /srv/app/
WORKDIR /srv/app/

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . ./

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0", "--reload", "app:api"]
