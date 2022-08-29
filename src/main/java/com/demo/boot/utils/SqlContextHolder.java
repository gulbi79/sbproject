package com.demo.boot.utils;

import java.util.ArrayList;
import java.util.List;

public class SqlContextHolder {
	public static final ThreadLocal<Boolean> THREAD_LOCAL_SQLYN = ThreadLocal.withInitial(() -> false);
	public static final ThreadLocal<List<String>> THREAD_LOCAL_SQL = ThreadLocal.withInitial(() -> new ArrayList<String>());
}
