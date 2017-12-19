from . import tld_regexpr
import re


TLD_RE = {}
def get_tld_re(tld):
	if tld in TLD_RE: return TLD_RE[tld]
	v = getattr(tld_regexpr, tld)
	extend = v.get('extend')
	if extend:
		e = get_tld_re(extend)
		tmp = e.copy()
		tmp.update(v)

	else:
		tmp = v

	if 'extend' in tmp: del tmp['extend']
	TLD_RE[tld] = dict((k, re.compile(v, re.IGNORECASE) if isinstance(v, str) else v) for k, v in tmp.items())
	return TLD_RE[tld]


[get_tld_re(tld) for tld in dir(tld_regexpr) if tld[0] != '_']


def do_parse(whois_str, tld):
	r = {}

	if whois_str.count('\n') < 5:
		s = whois_str.strip().lower()
		if s == 'not found': return
		if s.count('error'): return
		raise Exception(whois_str)

	sn = re.findall(r'Server Name:\s?(.+)', whois_str, re.IGNORECASE)
	if sn:
		whois_str = whois_str[whois_str.find('Domain Name:'):]

	things = TLD_RE.get(tld, TLD_RE['com'])

	for k, v in things.items():
		if v is None:
			r[k] = ['']

		else:
			r[k] = v.findall(whois_str) or ['']

	return r
