#/bin/sh
set -e
set -u

enter() {
  echo $1 | pv -qL $[10+(-2 + RANDOM%5)]
  eval $1 || true
  echo ""
}

prompt() {
	if [ $1 ]; then
		sleep $1
	fi

	if [ $? == 0 ]; then
		printf '\e[32m%s\e[m' "λ " | pv -q
	else
		printf '\e[31m%s\e[m' "λ " | pv -q
	fi
}

prompt 0.5
enter 'npm install @commitlint/cli @commitlint/config-conventional'

prompt 0.5
enter 'echo "module.exports = {extends: [\"@commitlint/config-conventional\"]};" > commitlint.config.js'

prompt 0.5
enter 'echo "foo" | commitlint'

prompt 0.5s
enter 'echo "foo: subject" | commitlint'

prompt 0.5s
enter 'git add commitlint.config.js'

prompt 0.5s
enter 'git commit -m "chore: add commitlint"'

prompt 0.5s
enter 'commitlint -e'

prompt 0.5s
enter 'commitlint --to HEAD'

prompt 5
