# from django import forms
# from django.forms import Form
# from . import views
#
# class SearchFilterForm(Form):
#     search = forms.ChoiceField(widget=forms.Select(), choices='',required=False)
#     results = views.Search(search)
#     return search
#   type = forms.ChoiceField(widget=forms.Select(), choices='',required=False)
#   fromdate = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'dd/mm/yyyy','class':'datefield','readonly':'readonly'}))
#   todate = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'dd/mm/yyyy','class':'datefield','readonly':'readonly'}))
#   search_keyword = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Keyword Search','class':'keyword-search'}))